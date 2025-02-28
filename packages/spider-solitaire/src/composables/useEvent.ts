import { ComputedRef, Ref } from 'vue'
import Hammer from 'hammerjs'
import { canICollectIt, canIDropIt, canSolitairesMove } from '../lib/validator'
import { SolitaireGroupItem, WindowSize } from '../types'
import { MovingGroupRecord, SolitaireGroup, SolitaireReturnType } from './useSolitaire'
import { getIntersectionRate } from '../lib/helper'

export interface UseEventReturnType {
  isDragging: Ref<boolean>
}

export default (
  dropTargetClassName: string,
  svgRef: Ref<SVGAElement | undefined>,
  movingSolitaireRef: Ref<any[]>,
  activeGroup: Ref<SolitaireGroup>,
  movingGroup: Ref<MovingGroupRecord>,
  inAnimation: Ref<boolean>,
  windowSize: ComputedRef<WindowSize>,
  dropIt: SolitaireReturnType['dropIt'],
  collectIt: SolitaireReturnType['collectIt']
): UseEventReturnType => {
  const startPosition = {
    left: 0,
    top: 0
  }

  // 当前选中的牌
  let targetSolitaire: SolitaireGroupItem | null = null

  // 被移动牌组处于 activateGroup 中的索引位置
  let sourceIdx = -1

  const isDragging = ref(false)

  const handleDragStart = (clientX: number, clientY: number, solitaires: SolitaireGroupItem[], subIndex: number): void => {
    if (!inAnimation.value && canSolitairesMove(solitaires, subIndex)) {
      startPosition.left = windowSize.value.isRotate ? clientY : clientX
      startPosition.top = windowSize.value.isRotate ? (windowSize.value.width - clientX) : clientY

      targetSolitaire = solitaires[subIndex]

      movingGroup.value = {
        index: activeGroup.value.indexOf(solitaires),
        subIndex,
        source: solitaires,
        solitaires: solitaires.slice(subIndex)
      }
      // 暂时移除当前牌组中被移动的元素
      solitaires.splice(subIndex)

      sourceIdx = activeGroup.value.indexOf(solitaires)

      isDragging.value = true
    }
  }

  const handleDragMove = (clientX: number, clientY: number): void => {
    if (!svgRef.value || !movingGroup.value.solitaires.length) {
      return
    }

    const x = windowSize.value.isRotate ? clientY : clientX
    const y = windowSize.value.isRotate ? (windowSize.value.width - clientX) : clientY

    movingSolitaireRef.value.forEach(target => {
      target.style.transform = `translate(${(x - startPosition.left) / windowSize.value.scale}px, ${(y - startPosition.top) / windowSize.value.scale}px)`
    })
  }

  const handleDragEnd = (): void => {
    if (!svgRef.value || !movingGroup.value.solitaires.length) {
      return
    }
    // 获取鼠标最后所在位置是否在牌组区域（每组牌最后一张的位置）
    const dropTargets = document.querySelectorAll<SVGAElement>(`.${dropTargetClassName}`)

    const movingRect = movingSolitaireRef.value[0].getBoundingClientRect()

    let isDrop = false
    let collectableIndex = -1

    for (let i = 0; i < dropTargets.length; i++) {
      // 跳过当前牌组
      if (i === sourceIdx) {
        continue
      }

      const intersectionRate = getIntersectionRate(movingRect, dropTargets[i].getBoundingClientRect())

      if (intersectionRate > 0.4) {
        if (!canIDropIt(activeGroup.value[i], targetSolitaire!)) {
          break
        }
        dropIt(i, sourceIdx, movingGroup.value.solitaires)
        isDrop = true

        if (canICollectIt(activeGroup.value[i])) {
          collectableIndex = i
        }
        break
      }
    }

    isDragging.value = false

    if (!isDrop) {
      // 没有放置成功，需要把临时被移动的数据都还原回去
      movingGroup.value.source.push(...movingGroup.value.solitaires)
    }

    movingGroup.value.source = []
    movingGroup.value.solitaires = []

    // 被放置的那组牌可以被收集了
    if (collectableIndex !== -1) {
      collectIt(collectableIndex)
    }
  }
  const initHammer = (): void => {
    const mc = new Hammer(svgRef.value!)
    mc.on('panstart', (e: HammerInput) => {
      if (e.target.matches('.active-solitaire')) {
        const index = Number(e.target.dataset.index!)
        const subIndex = Number(e.target.dataset.subIndex!)
        handleDragStart(e.deltaX, e.deltaY, activeGroup.value[index], subIndex)
      }
    })
    mc.on('panmove', (e: HammerInput) => {
      handleDragMove(e.deltaX, e.deltaY)
    })
    mc.on('panend', () => {
      handleDragEnd()
    })
  }

  onMounted(() => {
    initHammer()
  })

  return {
    isDragging
  }
}
